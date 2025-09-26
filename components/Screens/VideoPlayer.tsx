import { VideoView, useVideoPlayer } from 'expo-video';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface VideoPlayerProps {
  videoUrl: string;
  style?: any;
}

export default function VideoPlayer({ videoUrl, style }: VideoPlayerProps) {
  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = false;
    player.muted = false;
  });

  return (
    <View style={style}>
      <VideoView
        style={StyleSheet.absoluteFillObject}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        nativeControls
      />
    </View>
  );
}

const styles = StyleSheet.create({
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    pointerEvents: 'none', // Allow touches to pass through to the video
  },
});
