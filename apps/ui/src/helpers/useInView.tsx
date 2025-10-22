import { useRef, RefObject } from "react"
import { useInView as useInViewFromFramer } from 'framer-motion'

interface UseInViewOptions {
  once?: boolean;
  margin?: string;
}

export default function useInView({ once = true, margin = "-30px 0px 0px 0px" }: UseInViewOptions = {}): [RefObject<any>, boolean] {
  const ref = useRef(null)
  const isInView = useInViewFromFramer(ref, {
    once: once
  })

  return [ref, isInView]
}

