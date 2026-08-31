"use client";

import {
  useEffect,
  useState,
} from "react";


type Props = {
  initialColour: string;
};


export default function DynamicProductColour({
  initialColour,
}: Props) {
  const [
    colour,
    setColour,
  ] = useState(
    initialColour,
  );


  useEffect(() => {
    function handleVariantChange(
      event: Event,
    ) {
      const customEvent =
        event as CustomEvent<{
          colour?: string;
        }>;

      if (
        customEvent.detail
          ?.colour
      ) {
        setColour(
          customEvent.detail
            .colour,
        );
      }
    }


    window.addEventListener(
      "age202:original-variant-change",
      handleVariantChange,
    );


    return () => {
      window.removeEventListener(
        "age202:original-variant-change",
        handleVariantChange,
      );
    };
  }, []);


  return <>{colour}</>;
}