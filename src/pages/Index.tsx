import { Chat } from "@/components/Chat";
import { FileUpload } from "@/components/FileUpload";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-4xl font-bold text-primary">Virgil-Troubleshoot</h1>
          <p className="text-muted-foreground mt-2">
            AI-powered insights built by Cruz Wootten & Amber McCollum
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <FileUpload />
          </div>
          <div>
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;