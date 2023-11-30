const swap = <T>(arr: T[], firstIndex: number, secondIndex: number) => {
  const firstItem = arr[firstIndex];
  arr[firstIndex] = arr[secondIndex];
  arr[secondIndex] = firstItem;
}

const moveToNewIndex = <T>(arr: T[], currentIndex: number, newIndex: number) => {
  if (currentIndex === newIndex) {
    return;
  }

  if (currentIndex > newIndex) {
    for (; currentIndex > newIndex; currentIndex--) {
      swap(arr, currentIndex, currentIndex - 1);
    }
  } else if (currentIndex < newIndex) {
    for (; currentIndex < newIndex; currentIndex++) {
      swap(arr, currentIndex, currentIndex + 1);
    }
  }
}

export const reorderArray = <T>(arr: T[], currentIndex: number, newIndex: number, strategy: "before" | "after" = "after") => {
  if (!arr[currentIndex] || !arr[newIndex]) {
    return arr;
  }

  if (currentIndex > newIndex && strategy === "after") {
    newIndex = newIndex + 1;
  } else if (currentIndex < newIndex && strategy === "before") {
    newIndex = newIndex - 1;
  }

  moveToNewIndex(arr, currentIndex, newIndex);
};
