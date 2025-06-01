import { findMockRoute } from "@/mocks/stations";
import { useMutation } from "@tanstack/react-query";

async function fetchTransit(from: number, to: number) {
  const response = await fetch(`http://localhost:3002/api/transit/${from}/${to}`);
  if(!response.ok) {
    console.error('Error fetching transit', response.statusText);
    return findMockRoute(from, to);
  }
  const { stations } = await response.json();

  
  return stations;
}

export function useTransit(from: number, to: number) {
  return useMutation({
    mutationFn: () => fetchTransit(from, to),
  })
}