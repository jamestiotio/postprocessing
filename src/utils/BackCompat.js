import { LinearEncoding, REVISION, sRGBEncoding } from "three";
import { LinearSRGBColorSpace, SRGBColorSpace } from "../enums/index.js";

const revision = Number(REVISION.replace(/\D+/g, ""));
const useColorSpace = revision >= 152;

/**
 * @ignore
 */

const encodingToColorSpace = new Map([
	[LinearEncoding, LinearSRGBColorSpace],
	[sRGBEncoding, SRGBColorSpace]
]);

/**
 * @ignore
 */

const colorSpaceToEncoding = new Map([
	[LinearSRGBColorSpace, LinearEncoding],
	[SRGBColorSpace, sRGBEncoding]
]);

export { encodingToColorSpace, colorSpaceToEncoding };

/**
 * Returns the output color space of the given renderer.
 *
 * @param {WebGLRenderer} renderer - A renderer.
 * @return {ColorSpace} The output color space, or null if the renderer is null.
 * @ignore
 */

export function getOutputColorSpace(renderer) {

	return renderer === null ? null : useColorSpace ?
		renderer.outputColorSpace : encodingToColorSpace.get(renderer.outputEncoding);

}

/**
 * Sets the color space of a given texture.
 *
 * @param {Texture} texture - A texture.
 * @param {ColorSpace} colorSpace - The color space.
 * @ignore
 */

export function setTextureColorSpace(texture, colorSpace) {

	if(texture === null) {

		return;

	}

	if(useColorSpace) {

		texture.colorSpace = colorSpace;

	} else {

		texture.encoding = colorSpaceToEncoding.get(colorSpace);

	}

}

/**
 * Copies the color space of a source texture to a destination texture.
 *
 * @param {Texture} src - The source texture.
 * @param {Texture} dest - The destination texture.
 * @ignore
 */

export function copyTextureColorSpace(src, dest) {

	if(src === null || dest === null) {

		return;

	}

	if(useColorSpace) {

		dest.colorSpace = src.colorSpace;

	} else {

		dest.encoding = src.encoding;

	}

}

/**
 * Updates the given fragment shader for the current version of three.
 *
 * @param {String} fragmentShader - A fragment shader.
 * @return {String} The modified fragment shader.
 * @ignore
 */

export function updateFragmentShader(fragmentShader) {

	if(revision < 154) {

		return fragmentShader.replace("colorspace_fragment", "encodings_fragment");

	}

	return fragmentShader;

}

/**
 * Updates the given vertex shader for the current version of three.
 *
 * @param {String} vertexShader - A vertex shader.
 * @return {String} The modified vertex shader.
 * @ignore
 */

export function updateVertexShader(vertexShader) {

	return vertexShader;

}
