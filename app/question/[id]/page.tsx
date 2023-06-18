import dynamic from "next/dynamic";
const SingleQuestion = dynamic(() => import("@/app/components/SingleQuestion"));

type Props = {
  params: {
    id: string;
  };
};

// const getQuestion = async (id: string) => {
//   const res = await fetch(`http://localhost:3000/api/question/${id}`);
//   const resJson = await res.json();
//   return resJson.data;
// };

export default async function QuestionPage({ params: { id } }: Props) {
  // const question = await getQuestion(id);

  return (
    <div>
      <SingleQuestion id={id} />
    </div>
  );
}
