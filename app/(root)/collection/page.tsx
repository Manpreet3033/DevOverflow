import NoResult from "@/components/shared/NoResults";
import QuestionCard from "@/components/shared/cards/QuestionCard";
import Filter from "@/components/shared/filters/Filter";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import React from "react";

const Collection = async ({ searchParams }: SearchParamsProps) => {
  const { userId } = auth();
  if (!userId) return null;

  const result = await getSavedQuestions({
    clerkId: userId,
    searchQuery: searchParams.q,
    filter: searchParams.filter,
  });

  const saved = result.saved;

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex items-center justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/collection"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions..."
          otherClasses="flex w-full"
        />
        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {saved.length > 0 ? (
          saved.map((savedQuestion: any) => (
            <QuestionCard
              key={savedQuestion._id}
              _id={savedQuestion._id}
              title={savedQuestion.title}
              tags={savedQuestion.tags}
              author={savedQuestion.author}
              answers={savedQuestion.answers}
              upvotes={savedQuestion.upvotes}
              views={savedQuestion.views}
              createdAt={savedQuestion.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There's no saved question to show"
            description="Be the first to break the silence! 🚀 Save a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a question"
          />
        )}
      </div>
    </>
  );
};

export default Collection;
