package cl.drakescraft.knowledge;

import com.github.drakescraft_labs.slimefun4.api.items.ItemGroup;
import com.github.drakescraft_labs.slimefun4.api.items.SlimefunItem;
import com.github.drakescraft_labs.slimefun4.api.researches.Research;
import com.github.drakescraft_labs.slimefun4.core.attributes.EnergyNetComponent;
import com.github.drakescraft_labs.slimefun4.implementation.Slimefun;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.File;
import java.io.FileWriter;
import java.io.Writer;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.bukkit.ChatColor;
import org.bukkit.Bukkit;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.server.ServerLoadEvent;
import org.bukkit.inventory.ItemStack;
import org.bukkit.inventory.meta.ItemMeta;
import org.bukkit.plugin.java.JavaPlugin;

/**
 * Exporta el registro de Slimefun a JSON y apaga el servidor. Es la fuente de verdad de la base de
 * conocimiento: items, grupos, investigaciones, recetas (incluidas las de maquinas) y energia.
 * Cada item se exporta dentro de un try/catch: un addon roto no debe tirar todo el volcado.
 */
public final class SlimefunDump extends JavaPlugin implements Listener {

    private final Gson gson = new GsonBuilder().setPrettyPrinting().disableHtmlEscaping().create();

    @Override
    public void onEnable() {
        Bukkit.getPluginManager().registerEvents(this, this);
    }

    @EventHandler
    public void onLoaded(ServerLoadEvent event) {
        // Esperamos unos ticks a que todos los addons terminen de registrar sus items.
        Bukkit.getScheduler().runTaskLater(this, this::dump, 100L);
    }

    private void dump() {
        try {
            File out = new File(System.getProperty("knowledge.out", "slimefun-dump.json"));
            Map<String, Object> root = new LinkedHashMap<>();
            root.put("schema", 1);
            root.put("generated_at", java.time.Instant.now().toString());
            root.put("server", Bukkit.getVersion());
            root.put("slimefun", Slimefun.getVersion());

            List<Object> groups = new ArrayList<>();
            int order = 0;
            for (ItemGroup g : Slimefun.getRegistry().getAllItemGroups()) {
                try {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("key", g.getKey().toString());
                    m.put("order", order++);
                    m.put("name", strip(g.getUnlocalizedName()));
                    m.put("tier", g.getTier());
                    m.put("class", g.getClass().getSimpleName());
                    m.put("addon", g.getAddon() == null ? null : g.getAddon().getName());
                    Field f = ItemGroup.class.getDeclaredField("item");
                    f.setAccessible(true);
                    ItemStack icon = (ItemStack) f.get(g);
                    m.put("icon_material", icon.getType().name());
                    SlimefunItem iconSf = SlimefunItem.getByItem(icon);
                    if (iconSf != null) {
                        m.put("icon_sf", iconSf.getId());
                    }
                    ItemMeta im = icon.getItemMeta();
                    m.put("display_name", im != null && im.hasDisplayName() ? strip(im.getDisplayName()) : strip(g.getUnlocalizedName()));
                    m.put("lore", lore(icon));
                    if (g instanceof com.github.drakescraft_labs.slimefun4.api.items.groups.LockedItemGroup lg) {
                        List<String> parents = new ArrayList<>();
                        for (ItemGroup pg : lg.getParents()) {
                            parents.add(pg.getKey().toString());
                        }
                        m.put("locked_by", parents);
                    }
                    if (g instanceof com.github.drakescraft_labs.slimefun4.api.items.groups.SubItemGroup sg) {
                        m.put("parent", sg.getParent().getKey().toString());
                    }
                    List<String> ids = new ArrayList<>();
                    for (SlimefunItem it : g.getItems()) {
                        ids.add(it.getId());
                    }
                    m.put("items", ids);
                    groups.add(m);
                } catch (Throwable t) {
                    getLogger().warning("grupo omitido: " + t);
                }
            }
            root.put("groups", groups);

            List<Object> items = new ArrayList<>();
            int errors = 0;
            for (SlimefunItem sf : Slimefun.getRegistry().getAllSlimefunItems()) {
                try {
                    items.add(item(sf));
                } catch (Throwable t) {
                    errors++;
                    getLogger().warning("item omitido " + sf.getId() + ": " + t);
                }
            }
            root.put("items", items);
            root.put("item_errors", errors);

            List<Object> researches = new ArrayList<>();
            for (Research r : Slimefun.getRegistry().getResearches()) {
                try {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("key", r.getKey().toString());
                    m.put("name", strip(r.getUnlocalizedName()));
                    m.put("cost", r.getCost());
                    List<String> ids = new ArrayList<>();
                    for (SlimefunItem it : r.getAffectedItems()) {
                        ids.add(it.getId());
                    }
                    m.put("items", ids);
                    researches.add(m);
                } catch (Throwable t) {
                    getLogger().warning("investigacion omitida: " + t);
                }
            }
            root.put("researches", researches);

            Files.createDirectories(out.getAbsoluteFile().getParentFile().toPath());
            try (Writer w = new FileWriter(out, StandardCharsets.UTF_8)) {
                gson.toJson(root, w);
            }
            getLogger().info("Volcado: " + items.size() + " items, " + groups.size() + " grupos, "
                    + researches.size() + " investigaciones, " + errors + " errores -> " + out);
        } catch (Throwable t) {
            getLogger().severe("Fallo el volcado: " + t);
            t.printStackTrace();
        } finally {
            Bukkit.shutdown();
        }
    }

    private Map<String, Object> item(SlimefunItem sf) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", sf.getId());
        m.put("name", strip(sf.getItemName()));
        m.put("addon", sf.getAddon().getName());
        m.put("group", sf.getItemGroup().getKey().toString());
        m.put("disabled", sf.isDisabled());
        m.put("class", sf.getClass().getName());
        ItemStack icon = sf.getItem();
        m.put("material", icon.getType().name());
        m.put("lore", lore(icon));
        Research research = sf.getResearch();
        if (research != null) {
            m.put("research", research.getKey().toString());
            m.put("research_cost", research.getCost());
        }
        m.put("recipe_type", sf.getRecipeType().getKey().toString());
        List<Object> recipe = new ArrayList<>();
        for (ItemStack s : sf.getRecipe()) {
            recipe.add(stack(s));
        }
        m.put("recipe", recipe);
        m.put("output_amount", sf.getRecipeOutput() == null ? 1 : sf.getRecipeOutput().getAmount());

        if (sf instanceof EnergyNetComponent e) {
            Map<String, Object> en = new LinkedHashMap<>();
            en.put("type", String.valueOf(e.getEnergyComponentType()));
            en.put("capacity", e.getCapacity());
            Object consumption = call(sf, "getEnergyConsumption");
            if (consumption != null) {
                en.put("consumption_per_tick", consumption);
            }
            Object speed = call(sf, "getSpeed");
            if (speed != null) {
                en.put("speed", speed);
            }
            m.put("energy", en);
        }
        List<Object> machine = machineRecipes(sf);
        if (!machine.isEmpty()) {
            m.put("machine_recipes", machine);
        }
        return m;
    }

    private List<Object> machineRecipes(SlimefunItem sf) {
        List<Object> out = new ArrayList<>();
        try {
            Class<?> c = sf.getClass();
            Field f = null;
            while (c != null && f == null) {
                try {
                    f = c.getDeclaredField("recipes");
                } catch (NoSuchFieldException ignored) {
                    c = c.getSuperclass();
                }
            }
            if (f == null) {
                return out;
            }
            f.setAccessible(true);
            Object v = f.get(sf);
            if (!(v instanceof List<?> list)) {
                return out;
            }
            for (Object r : list) {
                Method gi = r.getClass().getMethod("getInput");
                Method go = r.getClass().getMethod("getOutput");
                Method gt = r.getClass().getMethod("getTicks");
                Map<String, Object> m = new LinkedHashMap<>();
                List<Object> in = new ArrayList<>();
                for (ItemStack s : (ItemStack[]) gi.invoke(r)) {
                    in.add(stack(s));
                }
                List<Object> o = new ArrayList<>();
                for (ItemStack s : (ItemStack[]) go.invoke(r)) {
                    o.add(stack(s));
                }
                m.put("input", in);
                m.put("output", o);
                m.put("ticks", gt.invoke(r));
                out.add(m);
            }
        } catch (Throwable ignored) {
            // sin recetas de maquina que exportar
        }
        return out;
    }

    private Object call(Object target, String name) {
        try {
            Method m = target.getClass().getMethod(name);
            return m.invoke(target);
        } catch (Throwable t) {
            return null;
        }
    }

    private Object stack(ItemStack s) {
        if (s == null || s.getType().isAir()) {
            return null;
        }
        Map<String, Object> m = new LinkedHashMap<>();
        SlimefunItem sf = SlimefunItem.getByItem(s);
        if (sf != null) {
            m.put("sf", sf.getId());
        } else {
            m.put("material", s.getType().name());
        }
        m.put("amount", s.getAmount());
        return m;
    }

    private List<String> lore(ItemStack s) {
        List<String> out = new ArrayList<>();
        ItemMeta meta = s.getItemMeta();
        if (meta != null && meta.getLore() != null) {
            for (String l : meta.getLore()) {
                String t = strip(l);
                if (!t.isBlank()) {
                    out.add(t);
                }
            }
        }
        return out;
    }

    private static String strip(String s) {
        return s == null ? "" : ChatColor.stripColor(ChatColor.translateAlternateColorCodes('&', s));
    }
}
