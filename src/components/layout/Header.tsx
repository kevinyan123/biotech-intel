import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b border-gray-200 bg-white px-6">
      <SearchBar />
    </header>
  );
}
