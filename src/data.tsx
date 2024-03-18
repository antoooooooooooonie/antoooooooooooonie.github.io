export const data = {
  help: `Hello, I'm Anthony Madhvani.

I run a one-man software consulting company called 
De Codefabriek, which roughly translates to
'The Code Manufactory'. 

I promise it sounds way cooler in Dutch.

My main focus is on React.JS and Node.JS.

I've served many clients over the years, big and
small.  

Currently, I'm located in Flanders, Belgium.

Commands:

* clients: my past and current clients
* services: what I can do for you
* status: am I currently available for work
* contact: how to reach me
* source: view this site's source code
* about: website lore! so meta!
* help: show this message


Controls:

* CTRL+L: clear the buffer
* ↑: go back in history
* ↓: go forward in history
* CTRL+R: search history`,

  services: `
* Lead the complete redesign of frontends, from brownfield to greenfield
* Create high-performance JS libraries
* Build APIs serving millions of customers daily
* Enhance GraphQL performance and optimize NPM libraries
* Streamline frontend CI workflows for automated deployment
* Collaborate closely with stakeholders for customer-centric solutions
* Proactively tackle technical challenges and identify project opportunities
* Present work at company conferences and navigate through acquisition processes
* Explore cutting-edge technologies like WebAssembly
* Author comprehensive design and implementation documents
* Providing mentorship and guidance to technical teams
* Fostering an open and positive developer atmosphere
* Communicating progress updates effectively with stakeholders
* Working in remote, global teams using agile methodologies`,

  about: `
* UI: Besides the novelty factor, I also genuinely 
believe a text user interface works really well here.
It allows me to create clutter-free, high-value store
of information.
And of course, it saves me the hassle of having to
vertically center a <div>. 

Even if you don't realize it, you're using command 
prompts everyday: When you search on Google, or ask
ChatGPT how many cats can fit into a standard minivan.

I wanted to explore this type of interface and see if
it's a viable option as the main navigation method on a 
website.

* Privacy:
I don't save any of your info.
Not because I don't care about, but because I do <3.

* Company:
Enterprise number: 0761.643.208
Name: De Codefabriek
Legal form:  Private limited company (BV)`,

  status: "I am currently not taking on new clients.",

  contact: `
I am most easily reachable via tribute_massifs.0j@icloud.com.
This is a relay address that will send mail to my actual address.`,

  source: `[<Open GitHub>](https://github.com/antoooooooooooonie/antoooooooooooonie.github.io)`,

  cow: `
~~~
    \\   ^__^
     \\  (oo)\\_______
        (__)\\       )\\/\\
            ||----w |
            ||     ||
~~~`,
  prefix: "guest@decodefabriek~> ",
  unknown: (input: string) => `Unknown command: ${input}`,
};