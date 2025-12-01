import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Laptop, Smartphone } from "lucide-react";

export default function ChooseExperience() {
    const navigate = useNavigate();

    const handleSelect = (mode: 'web' | 'mobile') => {
        localStorage.setItem("viewMode", mode);
        navigate("/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Choose Experience</CardTitle>
                    <p className="text-muted-foreground">Select how you want to view the dashboard</p>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Button
                        variant="outline"
                        className="h-24 text-lg flex flex-col gap-2 hover:bg-primary/5 hover:border-primary"
                        onClick={() => handleSelect('web')}
                    >
                        <Laptop className="h-8 w-8" />
                        Web Version
                    </Button>
                    <Button
                        variant="outline"
                        className="h-24 text-lg flex flex-col gap-2 hover:bg-primary/5 hover:border-primary"
                        onClick={() => handleSelect('mobile')}
                    >
                        <Smartphone className="h-8 w-8" />
                        Mobile Version
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
