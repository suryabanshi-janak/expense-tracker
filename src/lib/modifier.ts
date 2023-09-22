import { CategoryWithSubCategory, TransactionType } from '@/types';
import { Category, Expense, Income, Loan, Saving } from '@/types/collection';

export function getCategoryWithSubcategory(categoryData: Category[]) {
  // first data are sorted, so parent categories come before sub categories
  const sortedCategory = categoryData.sort((a, b) => {
    if (a.parent_id === null && b.parent_id !== null) {
      return -1;
    }
    if (a.parent_id !== null && b.parent_id === null) {
      return 1;
    }
    return 0;
  });

  const categories: CategoryWithSubCategory[] = sortedCategory.reduce(
    (acc: CategoryWithSubCategory[], category: Category) => {
      if (!category.parent_id) {
        acc.push({
          ...category,
          subcategories: [],
        });
      } else {
        const parentCategory = acc.find((cat) => cat.id === category.parent_id);
        if (parentCategory) {
          parentCategory.subcategories.push(category);
        }
      }
      return acc;
    },
    []
  );

  return categories;
}

export function getSubcategory(categoryData: Category[]) {
  return categoryData.reduce((acc: Category[], subcategory: Category) => {
    if (subcategory?.parent_id) {
      acc.push(subcategory);
    }
    return acc;
  }, []);
}

type TransactionData = Income | Expense | Loan | Saving;
export const getTransactionPayload = ({
  type,
  data,
  update,
}: {
  type: TransactionType;
  data: TransactionData;
  update?: boolean;
}) => {
  let payload: any = {
    amount: data.amount,
    description: data.description as string,
    transaction_type: type,
  };
  if (type === TransactionType.EXPENSE) {
    payload.transaction_date = (data as Expense).payment_date;
    payload.expense_id = (data as Expense).id;
  }
  if (type === TransactionType.INCOME) {
    payload.transaction_date = (data as Income).income_date;
    payload.income_id = (data as Income).id;
  }
  if (update) {
    delete payload.expense_id;
    delete payload.income_id;
  }
  return payload;
};
