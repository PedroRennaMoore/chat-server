
class HelloController {
    async hello(req,res) {
        res.json("Hello World")
    }
}

export default new HelloController()