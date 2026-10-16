import json
d = json.load(open("video/src/sf-capitulo1-storyboard.json", encoding="utf-8"))
for i, s in enumerate(d["scenes"]):
    print(f"{i+1}. {s['id']} | {s['title']} | diagram: {s['diagram']}")
