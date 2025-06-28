
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Sparkles, BookOpen, Plus, TrendingUp } from "lucide-react";

interface BuildModeProps {
  robotConnected: boolean;
}

interface Card {
  id: string;
  name: string;
  type: string;
  cost: string;
  power?: string;
  toughness?: string;
  rarity: string;
  quantity: number;
}

interface DeckSuggestion {
  name: string;
  theme: string;
  colors: string[];
  matchPercentage: number;
  description: string;
}

const BuildMode = ({ robotConnected }: BuildModeProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);

  const mockLibrary: Card[] = [
    { id: "1", name: "Lightning Bolt", type: "Instant", cost: "R", rarity: "Common", quantity: 4 },
    { id: "2", name: "Serra Angel", type: "Creature", cost: "3WW", power: "4", toughness: "4", rarity: "Uncommon", quantity: 2 },
    { id: "3", name: "Counterspell", type: "Instant", cost: "UU", rarity: "Common", quantity: 3 },
    { id: "4", name: "Sol Ring", type: "Artifact", cost: "1", rarity: "Uncommon", quantity: 1 },
    { id: "5", name: "Opt", type: "Instant", cost: "U", rarity: "Common", quantity: 4 },
    { id: "6", name: "Goblin Guide", type: "Creature", cost: "R", power: "2", toughness: "2", rarity: "Rare", quantity: 2 },
  ];

  const deckSuggestions: DeckSuggestion[] = [
    {
      name: "Burn Aggro",
      theme: "Fast damage",
      colors: ["Red"],
      matchPercentage: 85,
      description: "Lightning-fast deck focused on dealing direct damage"
    },
    {
      name: "Control",
      theme: "Counter & Control",
      colors: ["Blue", "White"],
      matchPercentage: 72,
      description: "Control the game with counterspells and powerful finishers"
    },
    {
      name: "Artifacts",
      theme: "Artifact synergy",
      colors: ["Colorless"],
      matchPercentage: 45,
      description: "Utilize powerful artifacts and colorless spells"
    }
  ];

  const recommendedCards = [
    { name: "Shock", reason: "Perfect complement to Lightning Bolt", synergy: "High" },
    { name: "Monastery Swiftspear", reason: "Great aggressive creature for burn", synergy: "High" },
    { name: "Brainstorm", reason: "Synergizes with Counterspell strategy", synergy: "Medium" },
  ];

  const filteredLibrary = mockLibrary.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCurrentDeck = (card: Card) => {
    setSelectedCards(prev => {
      const existing = prev.find(c => c.id === card.id);
      if (existing) {
        return prev.map(c => 
          c.id === card.id ? { ...c, quantity: Math.min(c.quantity + 1, 4) } : c
        );
      }
      return [...prev, { ...card, quantity: 1 }];
    });
  };

  const removeFromDeck = (cardId: string) => {
    setSelectedCards(prev => prev.filter(c => c.id !== cardId));
  };

  const totalDeckSize = selectedCards.reduce((sum, card) => sum + card.quantity, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Card Library */}
        <Card className="xl:col-span-2 bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Your Card Library</span>
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-300"
              />
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {filteredLibrary.map((card) => (
                  <div key={card.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{card.name}</h4>
                      <p className="text-gray-300 text-sm">{card.type}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="border-white/20 text-white text-xs">
                          {card.cost}
                        </Badge>
                        <span className="text-gray-400 text-xs">×{card.quantity}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => addToCurrentDeck(card)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Current Deck */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Current Deck ({totalDeckSize}/60)</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              {selectedCards.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No cards selected</p>
              ) : (
                <div className="space-y-2">
                  {selectedCards.map((card) => (
                    <div key={card.id} className="flex items-center justify-between p-2 bg-white/5 rounded">
                      <div>
                        <p className="text-white text-sm font-medium">{card.name}</p>
                        <p className="text-gray-400 text-xs">×{card.quantity}</p>
                      </div>
                      <Button
                        onClick={() => removeFromDeck(card.id)}
                        size="sm"
                        variant="destructive"
                        className="h-6 w-6 p-0"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            
            <div className="mt-4 pt-4 border-t border-white/20">
              <Button 
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                disabled={!robotConnected || totalDeckSize === 0}
              >
                Build Physical Deck
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suggestions */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span>AI Suggestions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="decks" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10">
              <TabsTrigger value="decks" className="data-[state=active]:bg-white/20 text-white">
                Deck Ideas
              </TabsTrigger>
              <TabsTrigger value="cards" className="data-[state=active]:bg-white/20 text-white">
                Card Recommendations
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="decks" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {deckSuggestions.map((deck, index) => (
                  <Card key={index} className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{deck.name}</h4>
                        <Badge variant="outline" className="border-green-400 text-green-400">
                          {deck.matchPercentage}%
                        </Badge>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">{deck.description}</p>
                      <div className="flex space-x-1 mb-3">
                        {deck.colors.map((color, i) => (
                          <div key={i} className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-blue-500"></div>
                        ))}
                      </div>
                      <Button size="sm" className="w-full">
                        Build This Deck
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="cards" className="mt-4">
              <div className="space-y-3">
                {recommendedCards.map((rec, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">{rec.name}</h4>
                      <p className="text-gray-300 text-sm">{rec.reason}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className={`border-${rec.synergy === 'High' ? 'green' : 'yellow'}-400 text-${rec.synergy === 'High' ? 'green' : 'yellow'}-400`}>
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {rec.synergy}
                      </Badge>
                      <Button size="sm">Add to Wishlist</Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuildMode;
