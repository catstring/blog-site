import React from 'react';

interface Tag {
  id: number;
  name: string;
}

interface TagFilterProps {
  tags: Tag[];
  selectedTags: string[];
  onTagClick: (tag: string) => void;
  onAllClick: () => void;
  theme: string;
}

// Randomize Array (Fisher-Yates Shuffle Algorithm)
const shuffleArray = (array: Tag[]) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const TagFilter: React.FC<TagFilterProps> = ({ tags, selectedTags, onTagClick, onAllClick, theme }) => {
  const shuffledTags = shuffleArray(tags);

  return (
    <div className="px-4 flex flex-nowrap overflow-x-auto gap-2 mb-4 scrollbar-hide">
      <span
        onClick={onAllClick}
        className={`px-4 py-2 text-sm font-medium cursor-pointer rounded-full ${selectedTags.length === 0 ? theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white' : theme === 'dark' ? 'bg-stone-700 text-white' : 'bg-stone-200 text-black'}`}
      >
        All
      </span>
      {shuffledTags.map(tag => (
        <span
          key={tag.id}
          onClick={() => onTagClick(tag.name)}
          className={`px-4 py-2 text-sm font-medium cursor-pointer rounded-full ${selectedTags.includes(tag.name) ? theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white' : theme === 'dark' ? 'bg-stone-700 text-white' : 'bg-stone-200 text-black'}`}
        >
          {tag.name}
        </span>
      ))}
    </div>
  );
};

export default TagFilter;
