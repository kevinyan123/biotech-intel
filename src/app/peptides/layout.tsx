import PeptideSubNav from "@/components/peptides/PeptideSubNav";

export default function PeptidesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <PeptideSubNav />
      {children}
    </div>
  );
}
