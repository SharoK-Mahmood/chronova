import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/ui/Container";

export function EmptyCart() {
  return (
    <Container className="py-20 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Your cart is empty</h1>
      <p className="mt-3 text-secondary">
        Browse the collection and add a watch to get started.
      </p>
      <div className="mt-8">
        <Button href="/products">Continue shopping</Button>
      </div>
    </Container>
  );
}
