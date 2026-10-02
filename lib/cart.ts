export type CartItem = {
    id: number;
    nom: string;
    prix: number;
    image_url?: string;
    quantity: number;
};

export const addToCart = (product: CartItem) => {
    const cart: CartItem[] = JSON.parse(
        localStorage.getItem("cart") || "[]"
    );

    const existingProduct = cart.find(
        (item) => item.id === product.id
    );

    if (existingProduct) {
        existingProduct.quantity += product.quantity;
    } else {
        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    window.dispatchEvent(new Event("cartUpdated"));
};

export const getCart = (): CartItem[] => {
    return JSON.parse(localStorage.getItem("cart") || "[]");
};

export const removeFromCart = (id: number) => {
    const cart = getCart().filter(
        (item) => item.id !== id
    );

    localStorage.setItem("cart", JSON.stringify(cart));

    window.dispatchEvent(new Event("cartUpdated"));
};