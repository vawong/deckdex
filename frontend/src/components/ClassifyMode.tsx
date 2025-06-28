
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Camera, Database, Eye, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DraftModeProps {
  robotConnected: boolean;
}

interface ScannedCard {
  id: string;
  name: string;
  type: string;
  cost: string;
  rarity: string;
  set: string;
}

const ClassifyMode = ({ robotConnected }: DraftModeProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedCards, setScannedCards] = useState<ScannedCard[]>([]);
  const [libraryStats, setLibraryStats] = useState({
    totalCards: 487,
    creatures: 189,
    spells: 156,
    lands: 98,
    artifacts: 44
  });
  const { toast } = useToast();

  const mockCards: ScannedCard[] = [
    { id: "1", name: "Lightning Bolt", type: "Instant", cost: "R", rarity: "Common", set: "M21" },
    { id: "2", name: "Serra Angel", type: "Creature - Angel", cost: "3WW", rarity: "Uncommon", set: "M21" },
    { id: "3", name: "Counterspell", type: "Instant", cost: "UU", rarity: "Common", set: "TSR" },
    { id: "4", name: "Sol Ring", type: "Artifact", cost: "1", rarity: "Uncommon", set: "CMR" },
    { id: "5", name: "Forest", type: "Basic Land", cost: "", rarity: "Common", set: "M21" },
  ];

  const handleStartScanning = () => {
    if (!robotConnected) {
      toast({
        title: "Robot Not Connected",
        description: "Please connect your robot before starting the scan.",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setScannedCards([]);

    // Simulate scanning process
    const scanInterval = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + 20;
        
        if (newProgress >= 100) {
          clearInterval(scanInterval);
          setIsScanning(false);
          setScannedCards(mockCards);
          setLibraryStats(prev => ({
            ...prev,
            totalCards: prev.totalCards + mockCards.length
          }));
          
          toast({
            title: "Scanning Complete!",
            description: `Successfully scanned and classified ${mockCards.length} new cards.`,
          });
          
          return 100;
        }
        
        return newProgress;
      });
    }, 800);
  };

  const exportLibrary = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Type,Cost,Rarity,Set\n" +
      scannedCards.map(card => 
        `${card.name},${card.type},${card.cost},${card.rarity},${card.set}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "mtg_library.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scanning Control */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Camera className="w-5 h-5" />
              <span>Card Scanner</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-4">
              <Button
                onClick={handleStartScanning}
                disabled={!robotConnected || isScanning}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                size="lg"
              >
                {isScanning ? "Scanning..." : "Start Scan"}
              </Button>
              
              {isScanning && (
                <div className="space-y-2">
                  <Progress value={scanProgress} className="w-full" />
                  <p className="text-white text-sm">Scanning cards... {scanProgress}%</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Library Stats */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Library Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-white">Total: <Badge variant="outline" className="border-white/20 text-white">{libraryStats.totalCards}</Badge></div>
              <div className="text-white">Creatures: <Badge variant="outline" className="border-green-400 text-green-400">{libraryStats.creatures}</Badge></div>
              <div className="text-white">Spells: <Badge variant="outline" className="border-blue-400 text-blue-400">{libraryStats.spells}</Badge></div>
              <div className="text-white">Lands: <Badge variant="outline" className="border-yellow-400 text-yellow-400">{libraryStats.lands}</Badge></div>
            </div>
            
            <Button
              onClick={exportLibrary}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10"
              disabled={scannedCards.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Library
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Quick View</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
              View Full Library
            </Button>
            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
              Search Cards
            </Button>
            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
              Collection Value
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recently Scanned Cards */}
      {scannedCards.length > 0 && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Recently Scanned Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {scannedCards.map((card) => (
                  <div key={card.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{card.name}</h4>
                      <p className="text-gray-300 text-sm">{card.type}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant="outline" className="border-white/20 text-white text-xs">
                        {card.rarity}
                      </Badge>
                      <p className="text-gray-400 text-xs">{card.set}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClassifyMode;
