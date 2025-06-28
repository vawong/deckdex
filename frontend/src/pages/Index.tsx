
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Library, Hammer, Wifi, WifiOff } from "lucide-react";
import DraftMode from "@/components/DraftMode";
import ClassifyMode from "@/components/ClassifyMode";
import BuildMode from "@/components/BuildMode";

const Index = () => {
  const [robotConnected, setRobotConnected] = useState(false);
  const [activeMode, setActiveMode] = useState("draft");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">MTG Card Sorter</h1>
              <p className="text-blue-200">Automated Magic: The Gathering deck management</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge 
              variant={robotConnected ? "default" : "secondary"}
              className={`flex items-center space-x-2 px-3 py-2 ${
                robotConnected ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {robotConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span>{robotConnected ? "Robot Connected" : "Robot Disconnected"}</span>
            </Badge>
            
            <Button
              onClick={() => setRobotConnected(!robotConnected)}
              variant={robotConnected ? "destructive" : "default"}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {robotConnected ? "Disconnect" : "Connect Robot"}
            </Button>
          </div>
        </div>

        {/* Main Interface */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-center text-2xl">
              Choose Your Sorting Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeMode} onValueChange={setActiveMode} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/10 mb-6">
                <TabsTrigger 
                  value="draft" 
                  className="flex items-center space-x-2 data-[state=active]:bg-white/20 text-white"
                >
                  <Zap className="w-4 h-4" />
                  <span>Draft Sort</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="classify"
                  className="flex items-center space-x-2 data-[state=active]:bg-white/20 text-white"
                >
                  <Library className="w-4 h-4" />
                  <span>Classify</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="build"
                  className="flex items-center space-x-2 data-[state=active]:bg-white/20 text-white"
                >
                  <Hammer className="w-4 h-4" />
                  <span>Build Deck</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="draft">
                <DraftMode robotConnected={robotConnected} />
              </TabsContent>
              
              <TabsContent value="classify">
                <ClassifyMode robotConnected={robotConnected} />
              </TabsContent>
              
              <TabsContent value="build">
                <BuildMode robotConnected={robotConnected} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
