import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../../lib/utils";

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
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between py-3">
                <CardTitle className="text-base">Recent Transactions</CardTitle>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => navigate('/expense')}>
                    View All
                </Button>
            </CardHeader>
            <CardContent className="pb-3 pt-0 grid gap-1">
                {transactions.map((tx) => (
                    <div key={tx.id} className="border-b last:border-0 pb-2 last:pb-0">
                        <div
                            className="flex items-center justify-between py-2 cursor-pointer"
                            onClick={() => toggleExpand(tx.id)}
                        >
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
                                {expandedId === tx.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                            </div>
                        </div>

                        {expandedId === tx.id && (
                            <div className="bg-muted/30 p-2 rounded-md text-xs text-muted-foreground grid gap-1 mb-2">
                                <div className="flex justify-between">
                                    <span>Category:</span>
                                    <span className="font-medium text-foreground">{tx.category}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Date:</span>
                                    <span className="font-medium text-foreground">{new Date(tx.date).toLocaleDateString()}</span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {transactions.length === 0 && (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                        No recent transactions
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
