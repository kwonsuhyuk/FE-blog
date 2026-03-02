import { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About",
  description: "프론트엔드 개발자 권수혁의 경험과 활동을 소개하는 페이지입니다.",
};

export default function AboutPage() {
  return <AboutClient />;
}
