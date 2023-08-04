import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const encodedQuery = encodeURI(searchQuery);
    router.push(`/search?q=${encodedQuery}`);
  };

  return (
    <form onSubmit={onSearch}>
      <div className="relative">
        <input
          type="search"
          value={searchQuery}
          placeholder="Search by title, tags or user..."
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-gray-300 rounded-3xl shadow-sm pl-10"
        />
        <Image
          src={"/search.svg"}
          alt={"search icon"}
          width={20}
          height={20}
          className="absolute top-2.5 left-3"
        />
      </div>
    </form>
  );
}
