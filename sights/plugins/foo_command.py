from sights.api import v1

class FooHandler:
    def __call__(self):
        print(f"Test")


foo_command = v1.Command(name="foo", description="Foo", handler_class=FooHandler, add_args=lambda p: None)


v1.register_command(foo_command)