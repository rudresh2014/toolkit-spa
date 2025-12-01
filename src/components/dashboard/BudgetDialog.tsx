import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function BudgetDialog({
    open,
    onOpenChange,
    currentBudget,
    onSave
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentBudget: number;
    onSave: (newBudget: number) => void;
}) {
    const [amount, setAmount] = useState(currentBudget.toString());

    useEffect(() => {
        setAmount(currentBudget.toString());
    }, [currentBudget, open]);

    const handleSave = () => {
        const val = parseFloat(amount);
        if (!isNaN(val) && val >= 0) {
            onSave(val);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Monthly Budget</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="budget" className="text-right text-sm font-medium">
                            Budget
                        </label>
                        <Input
                            id="budget"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="col-span-3"
                            placeholder="Enter budget amount"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
