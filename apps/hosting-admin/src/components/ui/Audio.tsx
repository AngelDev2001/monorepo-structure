import { type Ref, useEffect, useRef } from "react";
import styled from "styled-components";

interface AudioProps {
  ref: Ref<HTMLInputElement>;
  key: string;
  audio: string;
  autoPlay?: boolean;
}

export const Audio = ({ audio, autoPlay }: AudioProps) => {
  const audioRef = useRef(null);

  useEffect(() => {}, [audioRef]);

  return (
    <ContainerAudio
      ref={audioRef}
      key={`${audio}-${autoPlay}`}
      src={audio}
      autoPlay={autoPlay}
      preload="none"
      controls
    />
  );
};

const ContainerAudio = styled.audio<AudioProps>`
  visibility: hidden;
`;
