import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
export const Audio = ({ audio, autoPlay }) => {
    const audioRef = useRef(null);
    useEffect(() => { }, [audioRef]);
    return (_jsx(ContainerAudio, { ref: audioRef, src: audio, autoPlay: autoPlay, preload: "none", controls: true }, autoPlay));
};
const ContainerAudio = styled.audio `
  visibility: hidden;
`;
