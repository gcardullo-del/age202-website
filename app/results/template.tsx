"use client";

import {
  type ReactNode,
  useEffect,
  useState,
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

  const [
    lastRefresh,
    setLastRefresh,
  ] = useState<string>("");


  useEffect(() => {
    setLastRefresh(
      new Date().toLocaleTimeString(
        "it-IT",
      ),
    );

    const intervalId =
      window.setInterval(
        () => {
          setLastRefresh(
            new Date().toLocaleTimeString(
              "it-IT",
            ),
          );

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


  return (
    <>
      {children}

      <div className="fixed bottom-4 right-4 z-[9999] rounded-lg border border-[#C8FF00]/40 bg-[#050B18] px-4 py-2 text-xs font-semibold text-[#C8FF00] shadow-lg">
        TEST REFRESH:{" "}
        {lastRefresh || "—"}
      </div>
    </>
  );
}