import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { ScrollArea } from "../../ui/scroll-area";

type CategoryData = {
    name: string;
    value: number;
    color: string;
    percentage: number;
};

type CompactCategoryListProps = {
    data: CategoryData[];
};

export function CompactCategoryList({ data }: CompactCategoryListProps) {
    const topCategories = data.slice(0, 3);
    const [open, setOpen] = React.useState(false);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between py-3">
                <CardTitle className="text-base">Top Categories</CardTitle>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => setOpen(true)}>
                    View All
                </Button>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-h-[80vh]">
                        <DialogHeader>
                            <DialogTitle>All Categories</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="h-[60vh] pr-4">
                            <div className="grid gap-4">
                                {data.map((cat, index) => (
                                    <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="h-4 w-4 rounded-full"
                                                style={{ backgroundColor: cat.color }}
                                            />
                                            <span className="font-medium">{cat.name}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="font-bold">₹{cat.value.toLocaleString('en-IN')}</span>
                                            <span className="text-xs text-muted-foreground">{cat.percentage.toFixed(1)}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="pb-3 pt-0 gap-3 grid">
                {topCategories.map((cat, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: cat.color }}
                            />
                            <span className="text-sm font-medium">{cat.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground">{cat.percentage.toFixed(0)}%</span>
                            <span className="text-sm font-semibold">₹{cat.value.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
