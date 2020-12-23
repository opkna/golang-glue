package main

import (
	"os"
	"syscall/js"
)

var (
	bridge js.Value
)

func main() {
	if len(os.Args) < 1 {
		panic("Expected at least one argument");
	}

	if os.Args[0] != "js" {
		panic("Expected first argument to be 'js'")
	}

	bridge = js.Global()
	for i := range os.Args[1:] {
		bridge = bridge.Get(os.Args[i])
	}
}

// This will just return the first argument
func bounce(this js.Value, args []js.Value) interface{} {
	this.Set("result", args[0])
	return nil
}