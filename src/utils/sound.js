import beepAudio from "../assets/audio/beep.mp3";

export function beep() {
	const audio = new Audio(beepAudio);
	audio.play();
}
