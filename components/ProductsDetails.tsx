"use client";

import { useState } from "react";
import { Tab } from "@headlessui/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type ContentPost = {
  id: number;
  type: "content";
  content: string;
};

type InfoPost = {
  id: number;
  type: "info";
  data: Array<{ label: string; value: string }>;
};

type ReviewPost = {
  id: number;
  type: "review";
  author: string;
  date: string;
  rating: number;
  content: string;
};

type Post = ContentPost | InfoPost | ReviewPost;

const ProductsDetails = () => {
  const [categories] = useState<Record<string, Post[]>>({
    Description: [
      {
        id: 1,
        type: "content",
        content: `In ducimus quod sed eum repellendus ea fugiat. Pariatur et illo at iure harum. Molestiae a itaque voluptas explicabo praesentium. Possimus omnis aut architecto et. Repellendus ab ipsa in non doloremque tenetur est doloremque.
    
    Quam in facere soluta consequatur voluptatem beatae asperiores. Qui quia itaque illo eos quibusdam voluptatem et. Est aut deserunt iste. Et ipsum eius ut odit deleniti.
    
    Officia praesentium ipsam perferendis possimus ex culpa voluptatem dolore. Aut id sit et vitae. Quis unde doloremque quisquam facere. In qui eos est voluptatem repudiandae blanditiis consequatur.`,
      },
    ],
    "Additional Information": [
      {
        id: 1,
        type: "info",
        data: [
          { label: "Weight", value: "190 kg" },
          { label: "Dimensions", value: "3 × 72 × 109 cm" },
        ],
      },
    ],
    Reviews: [
      {
        id: 1,
        type: "review",
        author: "Duc Pham",
        date: "July 21, 2021",
        rating: 5,
        content: `I am 6 feet tall and 220 lbs. This shirt fit me perfectly in the chest and shoulders. My only complaint is that it is so long! I like to wear polo shirts untucked. This shirt goes completely past my rear end. If I wore it with ordinary shorts, you probably wouldnt be able to see the shorts at all – completely hidden by the shirt. It needs to be 4 to 5 inches shorter in terms of length to suit me. I have many RL polo shirts, and this one is by far the longest. I dont understand why.`,
      },
      {
        id: 2,
        type: "review",
        author: "Kenneth R. Myers",
        date: "July 21, 2021",
        rating: 5,
        content: `The shirt was not the fabric I believed it to be. It says Classic Fit but was made like the older versions, not the soft cotton like my others. I don't understand how the labels are the same but a completely different shirt. Oh well, stuck with it now.`,
      },
      {
        id: 3,
        type: "review",
        author: "Mike Addington",
        date: "July 21, 2021",
        rating: 5,
        content: `Real authentic genuine quality however it fit me like an XL size when In fact Im L. Beware`,
      },
      {
        id: 4,
        type: "review",
        author: "Ervin Arlington",
        date: "July 21, 2021",
        rating: 4,
        content: `The Ralph Lauren quaility is here in abundance. My husband always says that the Lauren polos fit better and last longer than any other brand.I love the new "heathered" color and the price is always excellent through shop`,
      },
      {
        id: 5,
        type: "review",
        author: "Patrick M. Newman",
        date: "July 21, 2021",
        rating: 3,
        content: `My son loved this Jacket for his Senior Prom… He got sooo many compliments! He is slim build 5'11 and 150lbs … I ordered a large … it was a little big … but it was fine!`,
      },
    ],
  });
  return (
    <div className="w-full max-w-3xl mb-10">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-zamzam-primary/10 p-1">
          {Object.keys(categories).map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-xs md:text-sm leading-5 text-zamzam-text-dark font-medium tracking-wide",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-zamzam-primary focus:outline-hidden focus:ring-2",
                  selected
                    ? "bg-white shadow-sm text-zamzam-primary font-semibold"
                    : "text-blue-100 hover:bg-white/12 hover:text-zamzam-primary"
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {Object.values(categories).map((posts, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames("rounded-xl bg-white py-3 space-y-4")}
            >
              {posts.map((post) => (
                <div key={post.id} className="relative rounded-md">
                  {post.type === "review" ? (
                    <div>
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-3 h-3 ${i < post.rating ? "text-light-green" : "text-gray-300"}`}
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                          ))}
                        </div>
                        <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                          <span className="font-semibold text-zamzam-text-dark tracking-wide">
                            {post.author}
                          </span>{" "}
                          - {post.date}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {post.content}
                      </p>
                    </div>
                  ) : post.type === "info" ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <tbody className="bg-white divide-y divide-gray-200">
                        {post.data.map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.label}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">
                      {post.content}
                    </p>
                  )}
                </div>
              ))}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default ProductsDetails;
