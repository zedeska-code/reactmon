"use client";

export default function Search({ placeholder }: { placeholder: string }) {
  const handleChange = (e) => {
    const query = e.target.value;

  };
  return (
    <div>
      <label htmlFor="filter"></label>
      <input
        type="text"
        name="search"
        placeholder={placeholder}
        onChange={handleChange}
      />
    </div>
  );
}
