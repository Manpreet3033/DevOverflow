import Link from "next/link";
import React from "react";
import Image from "next/image";
import RenderTag from "../tag/RenderTag";

const hotQuestions = [
  {
    _id: 1,
    title: "How do i use express as a custom server in NextJS?",
  },
  {
    _id: 2,
    title: "Is it only me or the font is bolder than necessary?",
  },
  {
    _id: 3,
    title: "Can i get the course for free?",
  },
  {
    _id: 4,
    title: "Redux Toolkit Not Updating State as Expected",
  },
  {
    _id: 5,
    title: "Async/Await Function Not Handling Errors Properly",
  },
];

const tags = [
  {
    _id: "1",
    name: "Javascript",
    totalQuestions: 5,
  },
  {
    _id: "2",
    name: "ReactJS",
    totalQuestions: 5,
  },
  {
    _id: "3",
    name: "NEXT",
    totalQuestions: 5,
  },
  {
    _id: "4",
    name: "REDUX",
    totalQuestions: 5,
  },
  {
    _id: "5",
    name: "VueJS",
    totalQuestions: 5,
  },
];

const RightSideBar = () => {
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky  right-0 top-0 flex h-screen flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden lg:w-[350px]">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map((question) => (
            <Link
              href={`/question/${question._id}`}
              key={question._id}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">
                {question.title}
              </p>
              <Image
                src={"/assets/icons/chevron-right.svg"}
                alt="chevron"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {tags.map((tag) => (
            <RenderTag
              key={tag._id}
              id={tag._id}
              name={tag.name}
              totalQuestions={tag.totalQuestions}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSideBar;
