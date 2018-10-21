module App.View

open Elmish
open Elmish.Browser.Navigation
open Elmish.Browser.UrlParser
open Fable.Core
open Fable.Core.JsInterop
open Fable.Import
open Fable.Import.Browser


open Blueprint.Components
open Blueprint.Props

importAll "../sass/main.sass"

type Msg =
  | ChangeName of string

type Model = {
    name: string
  }


let init () =
    {name = "dude"},Cmd.Empty

let update msg model =
    match msg with
    | ChangeName(str) -> {model with name = str},Cmd.Empty

let root model dispatch =
     Blueprint.Components.card [ CardProps.Interactive true ]
      [ Fable.Helpers.React.str "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris." ]


open Elmish.React
open Elmish.Debug
open Elmish.HMR
//|> Program.toNavigable (parseHash pageParser) urlUpdate
// App
Program.mkProgram init update root
|> Program.withReact "elmish-app"
#if DEBUG
|> Program.withDebugger
|> Program.withHMR
#endif
|> Program.run
