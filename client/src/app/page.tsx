import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "./page.module.css";
import HomePage from "../../components/HomePage";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="min-h-screen  min-h-[100dvh] w-screen bg-white flex items-center justify-center">
      <HomePage />
    </main>
  );
}
