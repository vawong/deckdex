
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, Play, Pause, RotateCcw, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DraftModeProps {
  robotConnected: boolean;
}

const DraftMode = ({ robotConnected }: DraftModeProps) => {
  const [draftList, setDraftList] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [sortedPiles, setSortedPiles] = useState<string[]>([]);
  const { toast } = useToast();

  const handleStartSorting = () => {
    if (!robotConnected) {
      toast({
        title: "Robot Not Connected",
        description: "Please connect your robot before starting the sort.",
        variant: "destructive",
      });
      return;
    }

    if (!draftList.trim()) {
      toast({
        title: "No Draft List",
        description: "Please paste your draft list before starting.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate robot processing
    setTimeout(() => {
      const cards = draftList.split('\n').filter(line => line.trim());
      const piles = ['Creatures', 'Spells', 'Lands', 'Artifacts', 'Others'];
      setSortedPiles(piles);
      setIsProcessing(false);
      
      toast({
        title: "Sorting Complete!",
        description: `Successfully sorted ${cards.length} cards into ${piles.length} piles.`,
      });
    }, 3000);
  };

  const handleReset = () => {
    setDraftList("");
    setSortedPiles([]);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Draft List Input</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your draft list here... (one card per line)&#10;Example:&#10;Lightning Bolt&#10;Counterspell&#10;Serra Angel"
              value={draftList}
              onChange={(e) => setDraftList(e.target.value)}
              className="min-h-40 bg-white/10 border-white/20 text-white placeholder:text-gray-300"
            />
            
            <div className="flex space-x-2">
              <Button
                onClick={() => document.getElementById('file-upload')?.click()}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Button>
              <input
                id="file-upload"
                type="file"
                accept=".txt,.csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setDraftList(event.target?.result as string);
                    };
                    reader.readAsText(file);
                  }
                }}
              />
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Control Section */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Sorting Control</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-4">
              <div className="text-white">
                Status: <Badge variant={isProcessing ? "default" : "secondary"}>
                  {isProcessing ? "Sorting..." : "Ready"}
                </Badge>
              </div>
              
              <Button
                onClick={handleStartSorting}
                disabled={!robotConnected || isProcessing}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start Sorting
                  </>
                )}
              </Button>
              
              {isProcessing && (
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      {sortedPiles.length > 0 && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Sorting Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {sortedPiles.map((pile, index) => (
                <div key={pile} className="text-center">
                  <div className="w-16 h-20 mx-auto mb-2 bg-gradient-to-b from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {index + 1}
                  </div>
                  <p className="text-white text-sm font-medium">{pile}</p>
                  <p className="text-gray-300 text-xs">{Math.floor(Math.random() * 10) + 5} cards</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DraftMode;
