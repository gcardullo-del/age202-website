"use client";

import {
  type ReactNode,
  useEffect,
} from "react";

import {
  useRouter,
} from "next/navigation";


const RESULTS_REFRESH_INTERVAL =
  5 * 60 * 1000;


type ResultsTemplateProps = {
  children: ReactNode;
};


export default function ResultsTemplate({
  children,
}: ResultsTemplateProps) {
  const router =
    useRouter();


  useEffect(() => {
    const intervalId =
      window.setInterval(
        () => {
          router.refresh();
        },
        RESULTS_REFRESH_INTERVAL,
      );


    return () => {
      window.clearInterval(
        intervalId,
      );
    };
  }, [
    router,
  ]);


  return children;
}