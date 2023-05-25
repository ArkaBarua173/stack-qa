export default async function getQuestion(id: string) {
  const res = await fetch(`http://localhost:3000/api/question/${id}`);
  const data = await res.json();
  return data.data;
}
