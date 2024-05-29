We're gonna first tackle Big O because I feel like Big O is that one thing that if you don't know it, I'm gonna be saying a bunch of nonsense up in this bitch. It sucks because we keep talking about it, and you don't know what it is. Big O categorizes your algorithm on time or memory based on the input. It's not an exact measurement; no one will say, "Your algorithm will take 450 CPU units." You'd ask, "What's a CPU unit?" and "How did you come up with that exact number?" Instead, it's a generalized way to understand how your algorithm will react as your input grows.

If someone says, "This is O of N," they mean your algorithm grows linearly based on input. Why do we use it? It helps us decide why to use or not use a specific data structure. Data structures make constraints to be more performant, but if used incorrectly, they become massively ill-performant. So here, let's take a quick code example. For those who know Big O, this is easy. If you don't, it would be hard to describe the running time of this code. Hopefully, we can get the lingo going.

Big O, as your input grows, how fast does your computation or memory grow? The most important concept is that growth is with respect to input. Remember that. In the real world, depending on the data size, memory allocation, and GC pressure, these are not free trade-offs. Creating memory takes time, so your algorithm is bound by how much memory you create.

Back to our example, how does our program grow with respect to input? I named it "n" intentionally. Notice it is a string, which has a length and a series of characters. Strings are effectively arrays. The for loop has to execute the length of the string. If our string grows by 50%, our function becomes 50% slower; it grows linearly. For each additional unit of string, there is one more loop.

For loops help tell Big O complexity. Now, we have a function that sums all the things happening in this string and then does it again. What's the running time of this function? Some might say O of N, but if we do a sum and then another sum, it seems like O of 2N. However, you always drop constants in Big O because constants aren't theoretically important, even though they are practically.

For example, 10N vs. N squared: N squared grows disproportionately faster regardless of the constant in front of linear O of N. We’re not trying to get exact time but understand growth. If N is 10,000, will it halt the computer, or will it be fast?

Bubble Sort is a simple sorting algorithm. Open your editor. Bubble Sort sorts in place. We need to translate our abstract idea into code. Start at 0 and go up to but not including N-1 because we compare i and i+1. If you go off the array, you get an array out of bounds exception. So, go up to but not including N-1. With each iteration, the last item becomes sorted.

Our inner loop goes up to N-1 and -i each time. We compare if array[i] is greater than array[i+1] and swap if true. The swap is simple: const tmp = arr[i], arr[i] = arr[i+1], arr[i+1] = tmp. Now, we've written Bubble Sort. This is a simple algorithm, easier than binary search. Your first sorting algorithm! Excited?

A map works by mapping a key to a value using a consistent hash. JavaScript is tricky because you can't uniquely identify objects. You can identify based on properties and values, but not uniquely. So, we use strings or numbers as entries.

We need a hashing function that takes a key and produces a unique number, modulo the length of our data storage. Each key maps to a bin in our array, storing the key and value. Collisions happen, and we need to store both items, using linear or exponential backoff or lists under the hood.

For retrieval, we use the hash function to get an index, modulo the storage size, and find the key-value pair. Deletion works similarly, removing the entry and decrementing the length. The ideal load factor is 0.7. When exceeded, we rehash and store in a larger storage arena, reducing the load factor.

That's how maps operate on systems.