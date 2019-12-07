import json
from collections import defaultdict

def main():
    with open('../src/songs/maimai-ChartData.json', encoding='utf-8') as chart:
        maimai_chart_data = json.load(chart)

    with open('../src/songs/maimai-SongData.json', encoding='utf-8') as song:        
        maimai_song_data = json.load(song)

    song_id = 1
    current_song = maimai_song_data[song_id - 1]

    chart_dict = defaultdict(lambda: [])

    # Get all the charts into a dict
    [chart_dict[cha["id"]].append(cha) for cha in maimai_chart_data]

    songs = []
    # Then map the songs to the charts
    for s in maimai_song_data:
        song = s
        song["charts"] = chart_dict[s["id"]]
        songs.append(song)


    with open(f'../src/songs/maimai-finale.json', mode='wb') as output:
        output.write(json.dumps(songs, ensure_ascii=False).encode('utf-8'))

if __name__ == "__main__":
    main()