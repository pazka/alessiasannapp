from moviepy.editor import VideoFileClip,CompositeVideoClip
import os
import sys

from converter import Converter
conv = Converter("C:\\Users\\Alexa\\Documents\\Tools\\ffmpeg\\bin\\ffmpeg.exe","C:\\Users\\Alexa\\Documents\\Tools\\ffmpeg\\bin\\ffprobe.exe")

path = sys.argv[1] if len(sys.argv) > 1 else '.'
fileTypes = sys.argv[2] if len(sys.argv) > 2 else ['mp4','wmv','webm','avi']

files = []
# r=root, d=directories, f = files
for r, d, f in os.walk(path):
    for file in f:
        for fileType in fileTypes:
            if fileType.lower() in file.lower():
                files.append(os.path.join(r, file))

for f in files:
    print(f)
    video = VideoFileClip(f).without_audio()
    fname = f.rsplit('.')
    print('.'.join(fname[0:len(fname)-1]) + "_thumbnail.jpeg")
    video.save_frame('.'.join(fname[0:len(fname)-1]) + "_thumbnail.jpeg",10)
    print('.'.join(fname[0:len(fname)-1]) + "_mini.webm")
    #convert = conv.convert(f, '.'.join(fname[0:len(fname)-1]) + "_mini.webm", {
    #    'format': 'webm',
    #    'video': {
    #        'codec': 'hevc',
    #        'width': 720,
    #        'height': 400,
    #        'fps': 23
    #    }})
    #for timecode in convert:
    #    print(f'\rConverting ({timecode:.2f}) ...')