import PeptideHeader from "@/components/peptides/PeptideSubNav";

export default function PeptidesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <PeptideHeader />
      {children}
    </div>
  );
}
