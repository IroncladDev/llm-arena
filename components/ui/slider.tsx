"use client"

import * as RadixSlider from "@radix-ui/react-slider"
import { styled } from "react-tailwind-variants"

export const Slider = styled(RadixSlider.Root, {
  base: "relative flex items-center user-select-none touch-action-none w-full h-5"
})

export const SliderTrack = styled(RadixSlider.Track, {
  base: "bg-highest relative grow rounded-full h-2"
})

export const SliderRange = styled(RadixSlider.Range, {
  base: "absolute bg-accent-dimmest rounded-full h-full"
})

export const SliderThumb = styled(RadixSlider.Thumb, {
  base: "block w-4 h-4 bg-accent-dimmer rounded-full ring-offset-0 ring-accent-dimmer/25 focus:ring-4 outline-none"
})
