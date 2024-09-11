// src/components/TagFilter.tsx
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

const TagFilter: React.FC<TagFilterProps> = ({ tags, selectedTags, onTagClick, onAllClick, theme }) => {
  return (
    <div className="px-4 flex flex-nowrap overflow-x-auto gap-2 mb-4 scrollbar-hide">
      <span
        onClick={onAllClick}
        className={`px-4 py-2 text-sm font-medium cursor-pointer rounded-full ${selectedTags.length === 0 ? theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white' : theme === 'dark' ? 'bg-stone-700 text-white' : 'bg-stone-200 text-black'}`}
      >
        All
      </span>
      {tags.map(tag => (
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
