
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Car,
  CreditCard,
  LayoutGrid,
  PlusCircle,
  ShoppingBag,
  Trash2,
  Utensils,
  CalendarIcon,
  Pencil,
  Wallet,
  Landmark,
  BadgeCent,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
} from "lucide-react";
import { format, startOfMonth, isSameMonth, isToday } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import {
  addExpense,
  deleteExpense as deleteExpenseFromDB,
  updateExpense,
  getExpenses,
  Expense,
  NewExpense,
  UpdatableExpense,
} from "@/lib/firestore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Footer } from "@/components/footer";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";


const expenseSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  amount: z.coerce.number().positive("Amount must be a positive number."),
  category: z.enum(["food", "transport", "shopping", "bills", "other"]),
  paymentMethod: z.enum(["cash", "upi"]),
  date: z.date(),
});

type ExpenseCategory = Expense["category"];

const categoryIcons: Record<ExpenseCategory, React.ReactNode> = {
  food: <Utensils className="h-4 w-4" />,
  transport: <Car className="h-4 w-4" />,
  shopping: <ShoppingBag className="h-4 w-4" />,
  bills: <CreditCard className="h-4 w-4" />,
  other: <LayoutGrid className="h-4 w-4" />,
};

const paymentMethodIcons: Record<Expense['paymentMethod'], React.ReactNode> = {
  cash: <Wallet className="h-4 w-4" />,
  upi: <Landmark className="h-4 w-4" />,
};

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  food: "#fb7185", // rose-400
  transport: "#38bdf8", // sky-400
  shopping: "#a78bfa", // violet-400
  bills: "#34d399", // emerald-400
  other: "#fbbf24", // amber-400
};

const PAYMENT_COLORS: Record<Expense["paymentMethod"], string> = {
  cash: "#fbbf24", // amber-400
  upi: "#38bdf8", // sky-400
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => {
          const safe = (cell ?? "").replaceAll('"', '""');
          return `"${safe}"`;
        })
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function EditExpenseDialog({
  expense,
  onUpdate,
}: {
  expense: Expense;
  onUpdate: (values: UpdatableExpense) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const form = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      name: expense.name,
      amount: expense.amount,
      category: expense.category,
      paymentMethod: expense.paymentMethod,
      date: expense.date,
    },
  });

  const handleSubmit = (values: z.infer<typeof expenseSchema>) => {
    onUpdate(values);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          aria-label="Edit expense"
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
          <DialogDescription>
            Make changes to your expense here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Lunch with friends" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 1500.50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="bills">Bills</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Expense</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                 <Button type="button" variant="ghost">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const EXPENSES_PER_PAGE = 5;

function PaginatedExpenseTable({ 
  expenses, 
  onUpdate, 
  onDelete 
}: {
  expenses: Expense[];
  onUpdate: (expenseId: string, values: UpdatableExpense) => void;
  onDelete: (expenseId: string) => void;
}) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [inputValue, setInputValue] = React.useState("1");
  const totalPages = Math.ceil(expenses.length / EXPENSES_PER_PAGE);

  React.useEffect(() => {
    // QoL: whenever the incoming list changes (filters/search/month switch),
    // reset pagination so you don't land on empty pages.
    setCurrentPage(1);
    setInputValue("1");
  }, [expenses]);

  const paginatedExpenses = expenses.slice(
    (currentPage - 1) * EXPENSES_PER_PAGE,
    currentPage * EXPENSES_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
    setInputValue(String(pageNumber));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const pageNumber = parseInt(inputValue, 10);
      if (!isNaN(pageNumber)) {
        handlePageChange(pageNumber);
      }
    }
  };

  React.useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      handlePageChange(totalPages);
    } else if (currentPage === 0 && totalPages > 0) {
      handlePageChange(1)
    }
  }, [totalPages, currentPage]);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <ExpenseTable expenses={paginatedExpenses} onUpdate={onUpdate} onDelete={onDelete} />
      </div>
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="ghost"
                onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                disabled={currentPage === 1}
                className="gap-1 pl-2.5"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </Button>
            </PaginationItem>

            <PaginationItem className="flex items-center gap-2 text-sm">
              <span className="hidden sm:inline">Page</span>
              <Input
                type="number"
                min="1"
                max={totalPages}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                className="h-8 w-14 text-center"
              />
              <span className="hidden sm:inline">of {totalPages}</span>
            </PaginationItem>
            
            <PaginationItem>
              <Button
                variant="ghost"
                onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                disabled={currentPage === totalPages}
                className="gap-1 pr-2.5"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

function ExpenseTable({ expenses, onUpdate, onDelete }: {
  expenses: Expense[];
  onUpdate: (expenseId: string, values: UpdatableExpense) => void;
  onDelete: (expenseId: string) => void;
}) {
  const emptyRows =
    expenses.length < EXPENSES_PER_PAGE
      ? Array(EXPENSES_PER_PAGE - expenses.length).fill(null)
      : [];

  return (
    <Table className="border-[3px] border-[color:rgb(15_23_42)] bg-card text-[13px]">
      <TableHeader>
        <TableRow className="bg-[hsl(3_84%_58%)] text-card-foreground">
          <TableHead className="border-b-[2px] border-[color:rgb(15_23_42)] text-[11px] font-extrabold uppercase tracking-[0.18em] text-card-foreground">
            Rank
          </TableHead>
          <TableHead className="border-b-[2px] border-[color:rgb(15_23_42)] text-[11px] font-extrabold uppercase tracking-[0.18em]">
            Name
          </TableHead>
          <TableHead className="hidden md:table-cell border-b-[2px] border-[color:rgb(15_23_42)] text-[11px] font-extrabold uppercase tracking-[0.18em]">
            Category
          </TableHead>
          <TableHead className="hidden lg:table-cell border-b-[2px] border-[color:rgb(15_23_42)] text-[11px] font-extrabold uppercase tracking-[0.18em]">
            Payment
          </TableHead>
          <TableHead className="hidden md:table-cell border-b-[2px] border-[color:rgb(15_23_42)] text-center text-[11px] font-extrabold uppercase tracking-[0.18em]">
            Date
          </TableHead>
          <TableHead className="border-b-[2px] border-[color:rgb(15_23_42)] text-right text-[11px] font-extrabold uppercase tracking-[0.18em]">
            Amount
          </TableHead>
          <TableHead className="w-[90px] border-b-[2px] border-[color:rgb(15_23_42)] text-center text-[11px] font-extrabold uppercase tracking-[0.18em]">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.length > 0 ? (
          expenses.map((expense, index) => (
            <TableRow
              key={expense.id}
              className="h-[56px] border-b border-[color:rgb(15_23_42_/_0.5)] odd:bg-card even:bg-[hsl(48_100%_94%)] hover:bg-[hsl(48_100%_90%)] transition-all duration-150 hover:-translate-y-[1px] hover:shadow-[3px_3px_0_0_rgb(15_23_42)]"
            >
              <TableCell className="align-middle text-sm font-semibold">
                {index + 1}
              </TableCell>
              <TableCell className="align-middle text-sm font-semibold">
                {expense.name}
              </TableCell>
              <TableCell className="hidden md:table-cell align-middle text-sm capitalize">
                {expense.category}
              </TableCell>
              <TableCell className="hidden lg:table-cell align-middle text-sm capitalize">
                {expense.paymentMethod}
              </TableCell>
              <TableCell className="hidden md:table-cell align-middle text-center text-sm text-muted-foreground">
                {format(expense.date, "dd MMM yyyy")}
              </TableCell>
              <TableCell className="align-middle text-right text-sm font-bold">
                {formatCurrency(expense.amount)}
              </TableCell>
              <TableCell className="align-middle">
                <div className="flex items-center justify-center gap-1">
                  <EditExpenseDialog
                    expense={expense}
                    onUpdate={(values) => onUpdate(expense.id, values)}
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        aria-label="Delete expense"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 border border-[color:rgb(15_23_42)] bg-card text-[color:rgb(15_23_42)] hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete this expense from your records.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(expense.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={7}
              className="h-24 text-center text-xs text-muted-foreground"
            >
              No expenses for this period.
            </TableCell>
          </TableRow>
        )}
        {emptyRows.map((_, index) => (
          <TableRow key={`empty-${index}`} className="h-[56px]">
            <TableCell colSpan={7}></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}


export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [isFetching, setIsFetching] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const searchRef = React.useRef<HTMLInputElement | null>(null);
  
  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  React.useEffect(() => {
    // QoL: press "/" to jump to search (common pattern in dashboards).
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  React.useEffect(() => {
    if (user) {
      const unsubscribe = getExpenses(user.uid, (newExpenses) => {
        setExpenses(newExpenses);
        setIsFetching(false);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const form = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      name: "",
      amount: "" as unknown as number,
      category: "other",
      paymentMethod: "cash",
      date: new Date(),
    },
  });

  const filteredExpenses = React.useMemo(() => {
    return expenses.filter(expense => {
      const categoryMatch = categoryFilter === 'all' || expense.category === categoryFilter;
      const searchMatch = searchTerm === '' ||
        expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(expense.amount).toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [expenses, searchTerm, categoryFilter]);

  const { currentMonthExpenses, pastMonthsExpenses } = React.useMemo(() => {
    const today = new Date();
    const current = filteredExpenses.filter(expense => isSameMonth(expense.date, today));
    const past = filteredExpenses.filter(expense => !isSameMonth(expense.date, today));
    
    const groupedByMonth = past.reduce((acc, expense) => {
      const monthKey = format(startOfMonth(expense.date), 'yyyy-MM');
      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: startOfMonth(expense.date),
          expenses: []
        };
      }
      acc[monthKey].expenses.push(expense);
      return acc;
    }, {} as Record<string, { month: Date; expenses: Expense[] }>);

    return {
      currentMonthExpenses: current,
      pastMonthsExpenses: Object.values(groupedByMonth).sort((a, b) => b.month.getTime() - a.month.getTime())
    };
  }, [filteredExpenses]);

  const categoryBreakdown = React.useMemo(() => {
    const totals: Record<ExpenseCategory, number> = {
      food: 0,
      transport: 0,
      shopping: 0,
      bills: 0,
      other: 0,
    };

    for (const exp of currentMonthExpenses) {
      totals[exp.category] += exp.amount;
    }

    const total = Object.values(totals).reduce((a, b) => a + b, 0);
    const items = (Object.entries(totals) as [ExpenseCategory, number][])
      .filter(([, amt]) => amt > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([category, amount]) => ({
        category,
        amount,
        percent: total > 0 ? Math.round((amount / total) * 100) : 0,
        fill: CATEGORY_COLORS[category],
      }));

    return { total, items };
  }, [currentMonthExpenses]);
  
  const dailyAndMonthlyTotals = React.useMemo(() => {
    const originalCurrentMonthExpenses = expenses.filter(expense => isSameMonth(expense.date, new Date()));
    const totals = originalCurrentMonthExpenses.reduce(
      (acc, expense) => {
        acc.monthlyTotal += expense.amount;
        if (expense.paymentMethod === "cash") {
          acc.monthlyCash += expense.amount;
        } else if (expense.paymentMethod === "upi") {
          acc.monthlyUpi += expense.amount;
        }
        if (isToday(expense.date)) {
          acc.dailyTotal += expense.amount;
        }
        return acc;
      },
      { monthlyTotal: 0, monthlyCash: 0, monthlyUpi: 0, dailyTotal: 0 }
    );
    return totals;
  }, [expenses]);

  async function onSubmit(values: z.infer<typeof expenseSchema>) {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add an expense.",
        variant: "destructive",
      });
      return;
    }
    try {
      await addExpense(user.uid, values as NewExpense);
      // Reset form but keep last-selected payment & category so UI and state stay in sync
      form.reset({
        name: "",
        amount: "" as unknown as number,
        category: values.category,
        paymentMethod: values.paymentMethod,
        date: new Date(),
      });
      toast({
        title: "Expense Added",
        description: `${values.name} has been successfully added.`,
      });
    } catch (error) {
      console.error("Error adding expense:", error);
      toast({
        title: "Error",
        description: "There was a problem adding your expense.",
        variant: "destructive",
      });
    }
  }
  
  async function handleUpdateExpense(expenseId: string, values: UpdatableExpense) {
    if (!user) return;
    try {
      await updateExpense(user.uid, expenseId, values);
      toast({
        title: "Expense Updated",
        description: "The expense has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating expense:", error);
      toast({
        title: "Error",
        description: "There was a problem updating the expense.",
        variant: "destructive",
      });
    }
  }

  async function deleteExpense(id: string) {
    if (!user) return;
    try {
      await deleteExpenseFromDB(user.uid, id);
      toast({
        title: "Expense Removed",
        description: "The expense has been successfully removed.",
      });
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast({
        title: "Error",
        description: "There was a problem removing the expense.",
        variant: "destructive",
      });
    }
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background/60">
        <div className="rounded-full border border-border/70 bg-muted/60 px-4 py-1 text-xs font-medium text-muted-foreground shadow-sm">
          Loading your dashboard…
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-5 p-4 sm:p-6 animate-in fade-in-50">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
              Hey, {user.displayName?.split(" ")[0] || "spender"} 👋
            </h1>
            <p className="text-xs text-muted-foreground">
              Here’s a quick vibe-check of your expenses. Add, edit and explore
              without any spreadsheet stress.
            </p>
          </div>
          <div className="kk-aurora-pill inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Live synced with your account
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="kk-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Spent (This Month)
              </CardTitle>
              <span className="text-2xl">💸</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(dailyAndMonthlyTotals.monthlyTotal)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total for {format(new Date(), "MMMM yyyy")}
              </p>
            </CardContent>
          </Card>
          <Card className="kk-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Spent (Today)
              </CardTitle>
              <BadgeCent className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(dailyAndMonthlyTotals.dailyTotal)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total for {format(new Date(), "do MMMM")}
              </p>
            </CardContent>
          </Card>
          <Card className="kk-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cash Spent (This Month)</CardTitle>
              <Wallet className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(dailyAndMonthlyTotals.monthlyCash)}
              </div>
               <p className="text-xs text-muted-foreground">
                This month via Cash
              </p>
            </CardContent>
          </Card>
          <Card className="kk-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total UPI Spent (This Month)</CardTitle>
              <Landmark className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(dailyAndMonthlyTotals.monthlyUpi)}
              </div>
               <p className="text-xs text-muted-foreground">
                This month via UPI
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="kk-card lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <CardTitle className="text-xl">Spend Breakdown</CardTitle>
                  <CardDescription className="text-xs">
                    This month’s spend across categories.
                  </CardDescription>
                </div>
                {categoryBreakdown.total > 0 && (
                  <div className="text-right text-xs text-muted-foreground">
                    <div className="font-medium text-foreground">
                      {formatCurrency(categoryBreakdown.total)}
                    </div>
                    <div>This month in total</div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              {categoryBreakdown.items.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="relative">
                    <ChartContainer
                      className="aspect-square max-h-[260px]"
                      config={{
                        amount: { label: "Amount", color: "hsl(var(--primary))" },
                      }}
                    >
                      <PieChart>
                        <ChartTooltip
                          content={
                            <ChartTooltipContent
                              nameKey="category"
                              formatter={(value) => (
                                <span className="font-mono tabular-nums">
                                  {formatCurrency(Number(value))}
                                </span>
                              )}
                            />
                          }
                        />
                        <Pie
                          data={categoryBreakdown.items}
                          dataKey="amount"
                          nameKey="category"
                          innerRadius={72}
                          outerRadius={110}
                          paddingAngle={2}
                          stroke="transparent"
                        >
                          {categoryBreakdown.items.map((entry) => (
                            <Cell key={entry.category} fill={entry.fill} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                  </div>
                  <div className="space-y-3">
                    {categoryBreakdown.items.slice(0, 5).map((item) => (
                      <div
                        key={item.category}
                        className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: item.fill }}
                          />
                          <span className="capitalize text-sm font-medium">
                            {item.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-medium text-muted-foreground">
                            {item.percent}%
                          </span>
                          <span className="font-mono text-sm tabular-nums">
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[220px] flex-col items-center justify-center gap-2 text-center">
                  <p className="text-sm font-medium">No expenses yet</p>
                  <p className="max-w-md text-xs text-muted-foreground">
                    Add a few expenses and your category chart will show up here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="kk-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Quick Filters</CardTitle>
              <CardDescription className="text-xs">
                Focus on a category or export a simple CSV.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["all", "All"],
                    ["food", "Food"],
                    ["transport", "Transport"],
                    ["shopping", "Shopping"],
                    ["bills", "Bills"],
                    ["other", "Other"],
                  ] as const
                ).map(([value, label]) => (
                  <Button
                    key={value}
                    type="button"
                    variant={categoryFilter === value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategoryFilter(value)}
                    className={cn(
                      "h-8 rounded-full px-3 text-xs",
                      categoryFilter !== value &&
                        "border-border/70 bg-background/70 hover:border-primary/60 hover:bg-primary/5"
                    )}
                    style={
                      value !== "all"
                        ? { borderColor: `${CATEGORY_COLORS[value as ExpenseCategory]}55` }
                        : undefined
                    }
                  >
                    {value !== "all" && (
                      <span
                        className="mr-2 h-2 w-2 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[value as ExpenseCategory] }}
                      />
                    )}
                    {label}
                  </Button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-full border-border/70 bg-background/70 text-xs hover:border-primary/60 hover:bg-primary/5"
                  onClick={() => {
                    if (!currentMonthExpenses.length) return;
                    downloadCsv(
                      `khorcha-khata-${format(new Date(), "yyyy-MM")}.csv`,
                      [
                        ["date", "name", "category", "paymentMethod", "amount"],
                        ...currentMonthExpenses.map((e) => [
                          format(e.date, "yyyy-MM-dd"),
                          e.name,
                          e.category,
                          e.paymentMethod,
                          String(e.amount),
                        ]),
                      ]
                    );
                  }}
                  disabled={!currentMonthExpenses.length}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
                {(searchTerm || categoryFilter !== "all") && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-full text-xs"
                    onClick={() => {
                      setSearchTerm("");
                      setCategoryFilter("all");
                    }}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="kk-card">
          <CardHeader>
            <CardTitle>Add a New Expense</CardTitle>
            <CardDescription>
              Fill out the form to add a new transaction to your list.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2 lg:col-span-3">
                      <FormLabel>Expense Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Lunch with friends"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. 1500.50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="food">Food</SelectItem>
                          <SelectItem value="transport">Transport</SelectItem>
                          <SelectItem value="shopping">Shopping</SelectItem>
                          <SelectItem value="bills">Bills</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="upi">UPI</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col sm:col-span-1 lg:col-span-2">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "h-10 w-full justify-start pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="h-10 w-full sm:col-span-1 lg:col-span-4"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Expense
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="kk-card mt-2 border-[3px] border-[color:rgb(15_23_42)] bg-card shadow-[6px_6px_0_0_rgb(15_23_42)]">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <CardTitle className="text-base font-extrabold uppercase tracking-[0.18em]">
                  Recent Expenses
                </CardTitle>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search expenses..."
                      className="pl-8 w-full sm:w-64"
                      ref={(el) => {
                        searchRef.current = el;
                      }}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="bills">Bills</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
             {isFetching ? (
              <div className="h-24 text-center text-muted-foreground flex items-center justify-center">
                <span className="kk-chip">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  Loading expenses…
                </span>
              </div>
            ) : currentMonthExpenses.length > 0 ? (
                <PaginatedExpenseTable
                  expenses={currentMonthExpenses}
                  onUpdate={handleUpdateExpense}
                  onDelete={deleteExpense}
                />
             ) : (
               <div className="flex min-h-[120px] flex-col items-center justify-center gap-2 text-center">
                 <div className="kk-chip">
                   <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                   Nothing matches your filters
                 </div>
                 <p className="text-xs text-muted-foreground">
                   Try clearing filters, or add a new expense above.
                 </p>
               </div>
             )}
          </CardContent>
        </Card>
        
         {pastMonthsExpenses.length > 0 && (
        <Card className="kk-card mt-2 border-[3px] border-[color:rgb(15_23_42)] bg-card shadow-[6px_6px_0_0_rgb(15_23_42)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-extrabold uppercase tracking-[0.18em]">
              Past Expenses
            </CardTitle>
            <CardDescription className="text-xs">
              Month-wise history in the same retro table style.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {pastMonthsExpenses.map(({ month, expenses: monthExpenses }) => {
                const monthTotal = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                return (
                  <AccordionItem
                    key={month.toISOString()}
                    value={month.toISOString()}
                    className="border-b border-[color:rgb(15_23_42_/_0.5)]"
                  >
                    <AccordionTrigger className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[hsl(48_100%_92%)]">
                      <div className="flex w-full items-center justify-between">
                        <span>{format(month, "MMMM yyyy")}</span>
                        <span className="text-[11px] font-bold">
                          {formatCurrency(monthTotal)}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-0 pt-0">
                      <div className="mt-2 overflow-x-auto">
                        <PaginatedExpenseTable
                          expenses={monthExpenses}
                          onUpdate={handleUpdateExpense}
                          onDelete={deleteExpense}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
        )}
        <Footer />
      </main>
    </div>
  );
}
