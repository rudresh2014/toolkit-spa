import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "../../../lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";

type Transaction = {
    id: string;
    title: string;
    amount: number;
    category: string;
    date: string;
    type: 'expense' | 'income';
};

type CompactTransactionsProps = {
    transactions: Transaction[];
};

export function CompactTransactions({ transactions }: CompactTransactionsProps) {
    const navigate = useNavigate();
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between py-3">
                    <CardTitle className="text-base">Recent Transactions</CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => navigate('/expense')}>
                        View All
                    </Button>
                </CardHeader>
                <CardContent className="pb-3 pt-0 grid gap-1">
                    {transactions.map((tx) => (
                        <div
                            key={tx.id}
                            className="border-b last:border-0 pb-2 last:pb-0"
                            onClick={() => setSelectedTx(tx)}
                        >
                            <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-muted/50 rounded-md px-1 transition-colors">
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "h-2 w-2 rounded-full",
                                        tx.type === 'expense' ? "bg-red-500" : "bg-green-500"
                                    )} />
                                    <span className="text-sm font-medium truncate max-w-[150px]">{tx.title}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "text-sm font-semibold",
                                        tx.type === 'expense' ? "text-red-500" : "text-green-500"
                                    )}>
                                        {tx.type === 'expense' ? '-' : '+'}₹{tx.amount.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {transactions.length === 0 && (
                        <div className="text-center py-4 text-sm text-muted-foreground">
                            No recent transactions
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={!!selectedTx} onOpenChange={(open) => !open && setSelectedTx(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Transaction Details</DialogTitle>
                    </DialogHeader>
                    {selectedTx && (
                        <div className="grid gap-4 py-4">
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-muted-foreground">Title</span>
                                <span className="font-medium">{selectedTx.title}</span>
                            </div>
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-muted-foreground">Amount</span>
                                <span className={cn(
                                    "font-bold text-lg",
                                    selectedTx.type === 'expense' ? "text-red-500" : "text-green-500"
                                )}>
                                    {selectedTx.type === 'expense' ? '-' : '+'}₹{selectedTx.amount.toLocaleString('en-IN')}
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-muted-foreground">Category</span>
                                <span className="font-medium">{selectedTx.category}</span>
                            </div>
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-muted-foreground">Date</span>
                                <span className="font-medium">{new Date(selectedTx.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Type</span>
                                <span className="capitalize font-medium">{selectedTx.type}</span>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
