"use client";

import { Question } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import QuestionItem from "../components/QuestionItem";
import { QuestionType } from "@/types";

const SearchResults = async (url: string) => {
  const res = await axios.get(`/api/search/?q=${url}`);
  return res.data.data;
};

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams ? searchParams.get("q") : null;
  const encodedSearchQuery = encodeURI(searchQuery ?? "");

  const { data, isLoading } = useQuery<QuestionType[]>({
    queryKey: ["SearchResults", encodedSearchQuery],
    queryFn: () => SearchResults(encodedSearchQuery),
  });

  console.log(data);

  return (
    <div>
      {" "}
      <div>
        {isLoading && <div className="text-center mt-3">Loading...</div>}
        {!isLoading && data?.length === 0 && (
          <div className="text-center font-bold">No results found</div>
        )}
        {!isLoading && data?.length !== 0 && (
          <div className="text-center font-bold mt-3">
            {data?.length} results found
          </div>
        )}
        {data?.map((question) => (
          <QuestionItem key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
}
