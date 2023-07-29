import dynamic from "next/dynamic";
const SingleQuestion = dynamic(
  () => import("@/app/components/SingleQuestion"),
  { ssr: false }
);

type Props = {
  params: {
    id: string;
  };
};

export default async function QuestionPage({ params: { id } }: Props) {
  return (
    <div>
      <SingleQuestion id={id} />
    </div>
  );
}
