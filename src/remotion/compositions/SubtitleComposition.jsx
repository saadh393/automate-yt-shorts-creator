import {
    AbsoluteFill,
    Audio,
    staticFile
} from "remotion";

export const SubtitleComposition = ({ data }) => {

    return (
        <AbsoluteFill>
            <Audio src={staticFile(`${data}`)} />
        </AbsoluteFill>
    );
};