import os
from PIL import Image, ImageDraw

base_dir = "/home/jack/Documentos/Desarrollo/Repositorios/personal/Slimefun-Knowledge-Drake/video/public/blocks"

# 1. JACK_O_LANTERN
jack_dir = os.path.join(base_dir, "JACK_O_LANTERN")
os.makedirs(jack_dir, exist_ok=True)

# Lados de calabaza naranja (16x16)
side = Image.new("RGBA", (16, 16), "#d35400")
draw = ImageDraw.Draw(side)
for x in [0, 4, 8, 12, 15]:
    draw.line([(x, 0), (x, 15)], fill="#a04000")
for y in range(16):
    for x in range(16):
        if (x + y) % 5 == 0:
            draw.point((x, y), fill="#e67e22")

top = side.copy()
draw_top = ImageDraw.Draw(top)
draw_top.rectangle([6, 6, 9, 9], fill="#4d3900")
draw_top.point((7, 7), fill="#735600")

front = side.copy()
draw_front = ImageDraw.Draw(front)
draw_front.polygon([(2, 3), (5, 3), (3, 6)], fill="#f1c40f")
draw_front.polygon([(10, 3), (13, 3), (12, 6)], fill="#f1c40f")
draw_front.polygon([(7, 7), (8, 7), (7, 9)], fill="#f39c12")
draw_front.polygon([(3, 10), (12, 10), (11, 13), (4, 13)], fill="#f1c40f")
draw_front.rectangle([5, 10, 6, 11], fill="#a04000")
draw_front.rectangle([9, 12, 10, 13], fill="#a04000")

side.save(os.path.join(jack_dir, "east.png"))
top.save(os.path.join(jack_dir, "up.png"))
front.save(os.path.join(jack_dir, "north.png"))

print("Jack o lantern textures created successfully!")

# 2. SOUL_LANTERN
lantern_dir = os.path.join(base_dir, "SOUL_LANTERN")
os.makedirs(lantern_dir, exist_ok=True)

# 16x16 farol de almas metálico azul
side_lan = Image.new("RGBA", (16, 16), (0, 0, 0, 0))
draw_l = ImageDraw.Draw(side_lan)
# Marco de hierro negro/gris
draw_l.rectangle([4, 2, 11, 14], outline="#2f3542", fill="#1e272e")
# Cristal y fuego azul de almas interior
draw_l.rectangle([5, 5, 10, 12], fill="#00d2d3")
draw_l.rectangle([6, 6, 9, 11], fill="#54a0ff")
draw_l.point((7, 8), fill="#ffffff")
draw_l.point((8, 9), fill="#ffffff")
# Asa superior
draw_l.rectangle([6, 0, 9, 2], outline="#2f3542", fill="#57606f")

side_lan.save(os.path.join(lantern_dir, "east.png"))
side_lan.save(os.path.join(lantern_dir, "north.png"))
side_lan.save(os.path.join(lantern_dir, "up.png"))

# 3. STONE_BRICKS
bricks_dir = os.path.join(base_dir, "STONE_BRICKS")
os.makedirs(bricks_dir, exist_ok=True)
stone = Image.new("RGBA", (16, 16), "#57606f")
draw_s = ImageDraw.Draw(stone)
# Patrón de ladrillos de piedra
draw_s.line([(0, 3), (15, 3)], fill="#2f3542")
draw_s.line([(0, 7), (15, 7)], fill="#2f3542")
draw_s.line([(0, 11), (15, 11)], fill="#2f3542")
draw_s.line([(0, 15), (15, 15)], fill="#2f3542")
draw_s.line([(7, 0), (7, 3)], fill="#2f3542")
draw_s.line([(15, 0), (15, 3)], fill="#2f3542")
draw_s.line([(3, 4), (3, 7)], fill="#2f3542")
draw_s.line([(11, 4), (11, 7)], fill="#2f3542")
draw_s.line([(7, 8), (7, 11)], fill="#2f3542")
draw_s.line([(15, 8), (15, 11)], fill="#2f3542")
draw_s.line([(3, 12), (3, 15)], fill="#2f3542")
draw_s.line([(11, 12), (11, 15)], fill="#2f3542")
for y in range(16):
    for x in range(16):
        if (x * 7 + y * 13) % 11 == 0:
            draw_s.point((x, y), fill="#747d8c")

stone.save(os.path.join(bricks_dir, "east.png"))
stone.save(os.path.join(bricks_dir, "north.png"))
stone.save(os.path.join(bricks_dir, "up.png"))

print("Soul lantern & Stone Bricks created!")

# 4. NETWORK CABLE TEXTURE
cable_dir = os.path.join(base_dir, "NETWORK_CABLE")
os.makedirs(cable_dir, exist_ok=True)
cable = Image.new("RGBA", (16, 16), "#1e272e")
draw_c = ImageDraw.Draw(cable)
draw_c.rectangle([4, 4, 11, 11], fill="#3867d6")
draw_c.rectangle([6, 6, 9, 9], fill="#00d2d3")
cable.save(os.path.join(cable_dir, "east.png"))
cable.save(os.path.join(cable_dir, "north.png"))
cable.save(os.path.join(cable_dir, "up.png"))

# 5. NETWORK BRIDGE TEXTURE
bridge_dir = os.path.join(base_dir, "NETWORK_BRIDGE")
os.makedirs(bridge_dir, exist_ok=True)
bridge = Image.new("RGBA", (16, 16), "#2f3542")
draw_b = ImageDraw.Draw(bridge)
draw_b.rectangle([2, 2, 13, 13], outline="#ff9f43", fill="#1e272e")
draw_b.rectangle([5, 5, 10, 10], fill="#ff9f43")
draw_b.rectangle([6, 6, 9, 9], fill="#feca57")
bridge.save(os.path.join(bridge_dir, "east.png"))
bridge.save(os.path.join(bridge_dir, "north.png"))
bridge.save(os.path.join(bridge_dir, "up.png"))

print("Network Cable & Bridge textures generated!")
