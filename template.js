tpl = `<div class="card mb-3">
          <div class="card-body d-flex justify-content-between flex-row">
            <div class="d-flex flex-column">
              <h3>{{title}}</h3>
              <p class="text-muted mb-2">{{details}}</p>
              <p class="mb-0 text-muted">
                {{TPL,expectedTpl,expected,notEmpty}}
              </p>              
            </div>
            <div class="d-flex flex-column text-center">
              <a class="vote btn btn-link" href="{{voteUpEndPoint}}">&#9650;</a>
              <h3 class="counter" id="{{id}}">{{count}}</h3>
              <a class="vote btn btn-link" href="{{voteDownEndPoint}}">&#9660;</a>
            </div>
          </div>
          <div class="card-footer d-flex flex-row justify-content-between">
            <div>
              <span class="text-info">{{state}}</span>
              &bullet; added by <strong>{{name}}</strong> on
              <strong>{{dated}}</strong>
            </div>
            <div
              class="d-flex justify-content-center flex-column 408ml-auto mr-2"
            >
              <div class="badge badge-success">
                {{level}}
              </div>
            </div>
          </div>
        </div>`;
var expectedTpl = `<strong>Expected results:</strong> {{expected}}`